import { Box, Flex, Text, Button, Spacer } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import supabase from "../supabaseClient";

import { useAppContext } from "../context/appContext";

export default function Header() {
  const { username, setUsername, randomUsername, session } = useAppContext();

  return (
    <Flex
      as="header"
      bg="white"
      align="center"
      justify="space-between"
      px={4}
      py={2}
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Text fontSize="lg" fontWeight="bold">
        ChatApp
      </Text>
      <Spacer />
      {session ? (
        <Flex align="center">
          <Text mr={4}>Welcome, <strong>{username}</strong></Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const { error } = supabase.auth.signOut();
              if (error) return console.error("error signOut", error);
              const username = randomUsername();
              setUsername(username);
              localStorage.setItem("username", username);
            }}
          >
            Log out
          </Button>
        </Flex>
      ) : (
        <Button
          size="sm"
          colorScheme="teal"
          rightIcon={<FaGithub />}
          variant="outline"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "github",
              redirectTo: window.location.origin,
            })
          }
        >
          GitHub
        </Button>
      )}
    </Flex>
  );
}
