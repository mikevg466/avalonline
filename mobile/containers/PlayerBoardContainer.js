import React from 'react';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import PlayerBoard from '../components/PlayerBoard';
import { MERLIN } from '../../characters';

class PlayerBoardContainer extends React.Component {
  constructor(props) {
    super(props);

    this.addToQuest = this.addToQuest.bind(this);
    this.removeFromQuest = this.removeFromQuest.bind(this);
    this.confirmQuest = this.confirmQuest.bind(this);
    this.approveQuest = this.approveQuest.bind(this);
    this.rejectQuest = this.rejectQuest.bind(this);
    this.successQuest = this.successQuest.bind(this);
    this.failQuest = this.failQuest.bind(this);
    this.selectLady = this.selectLady.bind(this);
    this.showLady = this.showLady.bind(this);
    this.cancelLady = this.cancelLady.bind(this);
    this.closeLady = this.closeLady.bind(this);
    this.assassinate = this.assassinate.bind(this);
  }
  state = {
    confirmLadyWindow: false,
    ladyWindow: false,
  }

  addToQuest(playerId) {
    const { params, firebase } = this.props;
    firebase.update(`/${params.lobbyId}/gameState/questPlayers`, { [playerId]: true });
  }

  removeFromQuest(playerId) {
    const { params, firebase } = this.props;
    firebase.remove(`/${params.lobbyId}/gameState/questPlayers/${playerId}`);
  }

  confirmQuest() {
    const { params, firebase, gameState } = this.props;
    const { voteHistory } = gameState;
    if (voteHistory && voteHistory.length === 4) {
      firebase.update(`/${params.lobbyId}/gameState/`, {
        state: 'questing',
        voteHistory: [...voteHistory, 'pass'] });
    } else {
      firebase.update(`/${params.lobbyId}/gameState/`, { state: 'voting' });
    }
  }
  approveQuest() {
    this.voteForQuest(true);
  }
  rejectQuest() {
    this.voteForQuest(false);
  }
  voteForQuest(vote) {
    const { params, currentPlayerId, firebase } = this.props;
    firebase.update(
      `/${params.lobbyId}/gameState/questApprovalVote`,
      { [currentPlayerId]: vote },
    );
  }

  successQuest() {
    this.quest(false);
  }

  failQuest() {
    this.quest(true);
  }

  quest(vote) {
    const { params, firebase, currentPlayerId } = this.props;
    firebase.update(
      `/${params.lobbyId}/gameState/questSuccessVote`,
      { [currentPlayerId]: vote },
    );
  }

  selectLady(playerId) {
    const { params, firebase } = this.props;
    firebase.update(`/${params.lobbyId}/gameState`, {
      state: 'pre-choosing',
      lady: playerId,
    });
    this.setState({
      confirmLadyWindow: true,
    });
  }
  showLady() {
    const { params, firebase } = this.props;
    firebase.update(`/${params.lobbyId}/gameState`, {
      state: 'choosing',
    });
    this.setState({
      confirmLadyWindow: false,
      ladyWindow: true,
    });
  }

  cancelLady() {
    const { params, firebase, currentPlayerId } = this.props;
    firebase.update(`/${params.lobbyId}/gameState`, {
      state: 'lady',
      lady: currentPlayerId,
    });
    this.setState({
      confirmLadyWindow: false,
    });
  }

  closeLady() {
    this.setState({
      ladyWindow: false,
    });
  }
  assassinate(player) {
    const { firebase, params } = this.props;
    if (player.special === MERLIN) {
      firebase.update(`/${params.lobbyId}/gameState`, {
        state: 'end',
        result: `The Assassin picked ${player.name}. Evil Wins!`,
      });
    } else {
      firebase.update(`/${params.lobbyId}/gameState`, {
        state: 'end',
        result: `The Assassin picked ${player.name}. Good Wins!`,
      });
    }
  }

  render() {
    const { players, currentPlayerId, gameState } = this.props;
    return (<PlayerBoard
      turnOrder={gameState.turnOrder}
      players={players}
      currentPlayer={players[currentPlayerId]}
      currentPlayerId={currentPlayerId}
      gameState={gameState}
      addToQuest={this.addToQuest}
      removeFromQuest={this.removeFromQuest}
      confirmQuest={this.confirmQuest}
      approveQuest={this.approveQuest}
      rejectQuest={this.rejectQuest}
      successQuest={this.successQuest}
      failQuest={this.failQuest}
      confirmLadyWindow={this.state.confirmLadyWindow}
      ladyWindow={this.state.ladyWindow}
      selectLady={this.selectLady}
      showLady={this.showLady}
      cancelLady={this.cancelLady}
      closeLady={this.closeLady}
      assassinate={this.assassinate}
    />);
  }
}

const wrappedPlayerBoardContainer = firebaseConnect(['/'])(PlayerBoardContainer);

export default connect(({ firebase, currentPlayer }, { params }) => ({
  players: dataToJS(firebase, `${params.lobbyId}/players`),
  gameState: dataToJS(firebase, `${params.lobbyId}/gameState`),
  currentPlayerId: currentPlayer,
}))(wrappedPlayerBoardContainer);
