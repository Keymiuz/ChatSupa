import { Box, Grid, GridItem } from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import MessageForm from "../components/MessageForm";

export default function Footer() {
  return (
    <Box position="fixed" bottom="0" width="100%">
      <MessageForm />

      <Grid
        gridTemplateColumns="auto 1fr"
        textAlign="center"
        alignItems="center"
        py="4px"
        px="30px"
        height="40px"
        bg="white"
      >
        <GridItem justifySelf="start">
          <a
            href="https://www.linkedin.com/in/keymius/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin style={{ display: "inline", marginRight: "5px" }} />
            João Cicolo
          </a>
        </GridItem>
        <GridItem justifySelf="end">
          <a
            href="https://github.com/shwosner/realtime-chat-supabase-react"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub style={{ display: "inline", marginRight: "5px" }} /> 
            Source code
          </a>
        </GridItem>
      </Grid>
    </Box>
  );
}
