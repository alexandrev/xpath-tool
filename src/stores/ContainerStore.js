import _ from 'underscore';
import alt from '../alt';

let MAX_LOG_SIZE = 3000;

class ContainerStore {
  constructor () {
    this.containers = {};

    // Pending container to create
    this.pending = null;
  }

  added ({container}) {
    let containers = this.containers;
    containers[container.Name] = container;
    this.setState({containers});
  }

  update ({name, container}) {
    let containers = this.containers;
    if (containers[name] && containers[name].State && containers[name].State.Updating) {
      return;
    }

    if (containers[name].State.Stopping) {
      return;
    }

    _.extend(containers[name], container);

    if (containers[name].State) {
      containers[name].State.Updating = true;
    }

    this.setState({containers});
  }

  updated ({container}) {
    if (!container || !container.Name) {
      return;
    }

    let containers = this.containers;
    if (containers[container.Name] && containers[container.Name].State.Updating) {
      return;
    }

    if (containers[container.Name] && containers[container.Name].Logs) {
      container.Logs = containers[container.Name].Logs;
    }

    containers[container.Name] = container;
    this.setState({containers});
  }

  allUpdated ({containers}) {
    this.setState({containers});
  }

  destroyed ({id}) {
    let containers = this.containers;
    let container = _.find(_.values(containers), c => c.Id === id || c.Name === id);

    if (container && container.State && container.State.Updating) {
      return;
    }

    if (container) {
      delete containers[container.Name];
      this.setState({containers});
    }
  }

}

export default alt.createStore(ContainerStore);
