import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import PlayerItem from '../../../mobile/components/PlayerItem';
import PlayersList from '../../../mobile/components/PlayersList';
import ConfirmButton from '../../../mobile/components/ConfirmButton';

describe('PlayersList component', () => {
  const props = {
    players: [
      { uid: 'player1', special: 'Merlin', role: 'good' },
      { uid: 'player2', role: 'good' },
      { uid: 'player3', special: 'Oberon', role: 'bad' },
    ],
    currentPlayer: { special: 'Mordered', role: 'bad', uid: 'player1' },
    gameState: { status: 'voting', questLeader: 0, questPlayers: { player1: true } },
    addToQuest: 'addToQuest',
    removeFromQuest: 'removeFromQuest',
    confirmQuest() { return 'confirmQuest'; },
    selectLady: 'selectLady',
  };
  it('should render a PlayerItem for each player', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(PlayerItem).length).to.equal(3);
  });
  it('should pass the player to each PlayerItem', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(PlayerItem).first().props().player.special).to.equal('Merlin');
  });
  it('should pass the currentPlayer to each PlayerItem', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(PlayerItem).first().props().currentPlayer.special).to.equal('Mordered');
  });
  it('should give us the key the uid', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(PlayerItem).first().key()).to.equal('player1');
  });
  it('should pass the game state to each playerItem', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(PlayerItem).first().prop('gameState').status).to.equal('voting');
  });
  it('should populate the quest leader with the playerId', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(PlayerItem).first().prop('gameState').questLeader).to.equal('player1');
  });
  it('should pass the addToQuest, RemoveFromQuest and selectLady fn', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(PlayerItem).first().prop('addToQuest')).to.equal('addToQuest');
    expect(wrapper.find(PlayerItem).first().prop('removeFromQuest')).to.equal('removeFromQuest');
    expect(wrapper.find(PlayerItem).first().prop('selectLady')).to.equal('selectLady');
  });
  it('should render the confirm button', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(ConfirmButton).length).to.equal(1);
  });
  it('should pass the currentPlayer id as current player', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(ConfirmButton).prop('currentPlayer')).to.equal('player1');
  });
  it('should pass the game state to each playerItem', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(ConfirmButton).prop('gameState').status).to.equal('voting');
  });
  it('should populate the quest leader with the playerId', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(ConfirmButton).prop('gameState').questLeader).to.equal('player1');
  });
  it('should modify the questPlayers into an array', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(ConfirmButton).prop('gameState').questPlayers[0]).to.equal('player1');
  });
  it('should pass the confirmQuest fn', () => {
    const wrapper = shallow(<PlayersList {...props} />);
    expect(wrapper.find(ConfirmButton).prop('confirmQuest')()).to.equal('confirmQuest');
  });

});
