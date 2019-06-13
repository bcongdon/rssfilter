import * as React from 'react';
import { Divider, Button, Input, Form, Popup } from 'semantic-ui-react';

export interface FeedFormValues {
  feedUrl: string;
  titleReject: string;
  titleAccept: string;
}

interface Props {
  onSubmit: (formValues: FeedFormValues) => void;
}

export class FeedForm extends React.Component<Props, FeedFormValues> {
  state: Readonly<FeedFormValues> = {
    feedUrl: '',
    titleAccept: '',
    titleReject: '',
  };

  handleFeedURLChange = (event: React.FormEvent) => {
    let feedUrl = (event.target as HTMLSelectElement).value;
    this.setState({ feedUrl });
  };

  handleTitleAcceptChange = async (event: React.FormEvent) => {
    let titleAccept = (event.target as HTMLSelectElement).value;
    this.setState({ titleAccept });
  };

  handleTitleRejectChange = async (event: React.FormEvent) => {
    let titleReject = (event.target as HTMLSelectElement).value;
    this.setState({ titleReject });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state);
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
        <Button color="green" onClick={this.onSubmit}>
          Get Feed
        </Button>
      </Form>
    );
  }
}
