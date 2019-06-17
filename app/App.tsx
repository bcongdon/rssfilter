import * as React from 'react';
import { Container, Header, Icon, Segment } from 'semantic-ui-react';
import { FeedForm, FeedFormValues } from './FeedForm';
import Footer from './components/Footer';
import FeedPreview from './components/FeedPreview';
import FeedLinkOutput from './components/FeedLinkOutput';
import * as QueryString from 'query-string';

import { baseURL } from './constants';

interface AppState {
  feedFormValues?: FeedFormValues;
}

export default class App extends React.Component<{}, AppState> {
  state: Readonly<AppState> = {
    feedFormValues: null,
  };

  onFormSubmit = (formValues: FeedFormValues) => {
    this.setState({ feedFormValues: formValues });
  };

  getFilterQueryString(): string {
    if (!this.state.feedFormValues) {
      return '';
    }
    const { feedUrl, titleReject, titleAccept } = this.state.feedFormValues;
    let query: any = {
      url: feedUrl,
      title_reject: titleReject,
      title_allow: titleAccept,
    };
    Object.keys(query).forEach(key => !query[key] && delete query[key]);
    const queryString = QueryString.stringify(query);
    return queryString;
  }

  getFilterFeedURL(): string {
    return `${baseURL}/feed?${this.getFilterQueryString()}`;
  }

  getPreviewFeedURL(): string {
    return `${baseURL}/preview_feed?${this.getFilterQueryString()}`;
  }

  render() {
    const filterUrl = this.getFilterFeedURL();
    const feedOutput =
      this.state.feedFormValues && this.state.feedFormValues.feedUrl ? (
        <Segment.Group>
          <FeedLinkOutput feedUrl={filterUrl} />
          <FeedPreview feedUrl={this.getPreviewFeedURL()} />
        </Segment.Group>
      ) : null;
    return (
      <Container text style={{ 'margin-top': '2rem' }}>
        <Header as="h2" icon textAlign="center">
          <Icon name="rss" circular />
          <Header.Content>RSS Filter</Header.Content>
          <Header.Subheader>
            RSSFilter is a simple web service that lets you filter articles out of RSS feeds.
          </Header.Subheader>
          <Header.Subheader> It's like email inbox rules, but for RSS feeds.</Header.Subheader>
        </Header>
        <Segment>
          <FeedForm onSubmit={this.onFormSubmit} />
        </Segment>
        {feedOutput}
        <div style={{ marginTop: 100 }}></div>
        <Footer />
      </Container>
    );
  }
}
