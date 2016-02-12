import alt from '../alt';

class ContainerServerActions {
  constructor () {
    this.generateActions(
      'added',
      'allUpdated',
      'destroyed',
      'updated'
    );
  }
}

export default alt.createActions(ContainerServerActions);
