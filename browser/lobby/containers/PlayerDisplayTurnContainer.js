import React from 'react';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import PlayerDisplayTurn from '../components/PlayerDisplayTurn';

class PlayerDisplayTurnContainer extends React.Component {

  render() {
    const { players, turnOrder, questLeader, questPlayers } = this.props;
    return (
      <div className="player-card-container">
        <div className="flex-container">
          { turnOrder.map((id, i) => (<PlayerDisplayTurn
            key={id}
            player={players[id]}
            isQuestLeader={questLeader === i}
            onQuest={Object.keys(questPlayers).indexOf(id) >= 0}
          />))}
        </div>
      </div>
    );
  }
}

const wrappedPlayerDisplayTurnContainer = firebaseConnect(['/'])(PlayerDisplayTurnContainer);

export default connect(({ firebase }, ownProps) => ({
  players: dataToJS(firebase, `${ownProps.lobbyId}/players`),
  turnOrder: dataToJS(firebase, `${ownProps.lobbyId}/gameState/turnOrder`),
  questLeader: dataToJS(firebase, `${ownProps.lobbyId}/gameState/questLeader`),
  questPlayers: dataToJS(firebase, `${ownProps.lobbyId}/gameState/questPlayers`),
  lobbyId: ownProps.lobbyId,
}))(wrappedPlayerDisplayTurnContainer);
