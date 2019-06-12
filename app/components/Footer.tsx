import * as React from 'react';
import { Container, Icon } from 'semantic-ui-react';

const Footer: React.FunctionComponent<{}> = () => (
  <Container textAlign="center">
    <div>
      <a href="https://github.com/bcongdon/rssfilter">
        <Icon name="github" size="large" link />
      </a>
    </div>
    Made by <a href="https://benjamincongdon.me">Benjamin Congdon</a>, 2019.
  </Container>
);

export default Footer;
