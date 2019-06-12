import * as React from 'react';
import { FeedForm, FeedFormValues } from './FeedForm';

interface AppState {
  feedFormValues?: FeedFormValues;
}

export default class App extends React.Component<{}, AppState> {
  state: Readonly<AppState> = {
    feedFormValues: null,
  };

  onFormChange(formValues: FeedFormValues) {
    this.setState({ feedFormValues: formValues });
  }

  getFeedURL(): string {
    const { feedFormValues } = this.state;
    return feedFormValues != null ? feedFormValues.feedURL : '';
  }

  render() {
    console.log(this.state);
    return <FeedForm onChange={this.onFormChange} filterFeedURL={this.getFeedURL()} />;
  }
}
