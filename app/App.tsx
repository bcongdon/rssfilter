import * as React from 'react';
import { Container, Header, Icon, Segment } from 'semantic-ui-react';
import { FeedForm, FeedFormValues } from './FeedForm';
import Footer from './components/Footer';

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
    return (
      <Container style={{ 'margin-top': '2rem' }}>
        <Header as="h2" icon textAlign="center">
          <Icon name="rss" circular />
          <Header.Content>RSS Filter</Header.Content>
          <Header.Subheader>
            RSSFilter is a simple web service that lets you filter articles out of RSS feeds.
          </Header.Subheader>
          <Header.Subheader> It's like email inbox rules, but for RSS feeds.</Header.Subheader>
        </Header>
        <Segment>
          <FeedForm onChange={this.onFormChange} filterFeedURL={this.getFeedURL()} />
        </Segment>
        <div style={{ marginTop: 100 }}></div>
        <Footer />
      </Container>
    );
  }
}
