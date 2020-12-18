import React from 'react';
import * as Sentry from '@sentry/react';
import { Box, Text, Heading } from '@chakra-ui/react';

function FallbackComponent() {
  return (
    <Box>
      <Heading as="p" size="md">
        Sorry, there was an error!
      </Heading>
      <Text color="gray.700">
        Our development team has been notified and is working on a fix. We
        apologize for the inconvenience.
      </Text>
    </Box>
  );
}

class ErrorBoundaryWrapper extends React.Component {
  render() {
    return (
      <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
        {this.props.children}
      </Sentry.ErrorBoundary>
    );
  }
}

export default ErrorBoundaryWrapper;