import * as React from 'react';
import { Formik, FormikActions, FormikProps, Field, FieldProps } from 'formik';
import { Divider, Button, Input, Form, Popup } from 'semantic-ui-react';
import * as QueryString from 'query-string';

export interface FeedFormValues {
  feedURL: string;
  titleReject: string;
  titleAccept: string;
}

interface FeedFormProps {
  onChange: (formValues: FeedFormValues) => void;
  filterFeedURL?: string;
}

interface State extends FeedFormValues {
  showCopyPopup: boolean;
}

const baseURL: string = 'https://rssfilter-a7aj2utffa-uc.a.run.app';

export class FeedForm extends React.Component<FeedFormProps, State> {
  private feedURLInputRef: React.RefObject<Input> = React.createRef();

  state: Readonly<State> = {
    feedURL: '',
    titleAccept: '',
    titleReject: '',
    showCopyPopup: false,
  };

  handleFeedURLChange = (event: React.FormEvent) => {
    this.setState({ feedURL: (event.target as HTMLSelectElement).value });
  };

  handleTitleAcceptChange = (event: React.FormEvent) => {
    this.setState({ titleReject: (event.target as HTMLSelectElement).value });
  };

  handleTitleRejectChange = (event: React.FormEvent) => {
    this.setState({ titleAccept: (event.target as HTMLSelectElement).value });
  };

  getFilterFeedURL(): string {
    const { feedURL, titleReject, titleAccept } = this.state;
    if (!feedURL) {
      return '';
    }

    let query: any = {
      url: feedURL,
      title_reject: titleReject,
      title_accept: titleAccept,
    };
    Object.keys(query).forEach(key => !query[key] && delete query[key]);
    const queryString = QueryString.stringify(query);
    return `${baseURL}/feed?${queryString}`;
  }

  onCopy = () => {
    this.feedURLInputRef.current.select();
    document.execCommand('copy');
    this.setState({ showCopyPopup: true });
    setTimeout(() => {
      this.setState({ showCopyPopup: false });
    }, 1000);
  };

  render() {
    return (
      <Form>
        <Form.Field required>
          <label>RSS Feed URL</label>
          <input placeholder="RSS Feed URL" onChange={this.handleFeedURLChange} />
        </Form.Field>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Title Accept</label>
            <input
              placeholder="A regex for titles to accept"
              onChange={this.handleTitleAcceptChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Title Reject</label>
            <input
              placeholder="A regex for titles to reject"
              onChange={this.handleTitleRejectChange}
            />
          </Form.Field>
        </Form.Group>
        <Divider />
        <Input
          ref={this.feedURLInputRef}
          disabled={this.getFilterFeedURL() === ''}
          action={
            <Popup
              inverted
              open={this.state.showCopyPopup}
              trigger={
                <Button
                  disabled={this.getFilterFeedURL() === ''}
                  color="teal"
                  labelPosition="right"
                  icon="copy"
                  content="Copy"
                  onClick={this.onCopy}
                />
              }
              content="Copied!"
            />
          }
          value={this.getFilterFeedURL()}
        />
      </Form>
    );
  }
}
