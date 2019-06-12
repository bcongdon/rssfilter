import * as React from 'react';
import { Button, Input, Popup, Segment, Header } from 'semantic-ui-react';

interface Props {
  feedUrl: string;
}

interface State {
  showCopyPopup: boolean;
}

export default class FeedLinkOutput extends React.Component<Props, State> {
  private feedURLInputRef: React.RefObject<Input> = React.createRef();

  state: Readonly<State> = {
    showCopyPopup: false,
  };

  onCopy = () => {
    this.feedURLInputRef.current.select();
    document.execCommand('copy');
    this.setState({ showCopyPopup: true });
    setTimeout(() => {
      this.setState({ showCopyPopup: false });
    }, 1000);
  };

  render() {
    const { showCopyPopup } = this.state;
    const { feedUrl } = this.props;
    return (
      <Segment>
        <Header as="h3">Filtered Feed</Header>
        <Input
          fluid
          ref={this.feedURLInputRef}
          action={
            <Popup
              inverted
              open={showCopyPopup}
              trigger={
                <Button
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
          value={feedUrl}
        />
      </Segment>
    );
  }
}
