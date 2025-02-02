// In src/components/Messages.jsx
import { Image } from "@chakra-ui/react";
import { Alert, Box, Button, Spinner } from "@chakra-ui/react";
import { useAppContext } from "../context/appContext";
import Message from "./Message";

export default function Messages() {
  const { username, loadingInitial, error, getMessagesAndSubscribe, messages } =
    useAppContext();
  const reversed = [...messages].reverse();
  if (loadingInitial)
    return (
      <Box textAlign="center">
        <Spinner />
      </Box>
    );
  if (error)
    return (
      <Alert status="error" mt="20px">
        {error}
        <Button
          ml="5px"
          onClick={getMessagesAndSubscribe}
        >
          Retry
        </Button>
      </Alert>
    );

  if (!messages.length)
    return (
      <Box as="h3" textAlign="center">
        No messages 😞
      </Box>
    );

  return (
    <>
      {reversed.map((message) => {
        const isYou = message.username === username;
        return (
          <Message key={message.id} message={message} isYou={isYou}>
            {message.text}
            {message.file_url && (
              <Image 
                src={message.file_url} 
                maxW="200px"
                mt={2}
                borderRadius="md"
                alt="Uploaded content"
              />
            )}
          </Message>
        );
      })}
    </>
  );
}
