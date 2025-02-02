import { useState } from "react";
import {
  Input,
  Stack,
  IconButton,
  useToast,
  Container
} from "@chakra-ui/react";
import { BiSend } from "react-icons/bi";
import { useAppContext } from "../context/appContext";
import supabase from "../supabaseClient";
import FileUpload from "./FileUpload";

export default function MessageForm() {
  const { username, country, session } = useAppContext();
  const [message, setMessage] = useState("");
  const toast = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const { error } = await supabase.from("messages").insert([{
        text: message,
        username,
        country,
        is_authenticated: session ? true : false
      }]);

      if (error) throw error;
      setMessage("");
      
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container maxW="600px" p={4}>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2}>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
          <FileUpload />
          <IconButton
            type="submit"
            aria-label="Send message"
            icon={<BiSend />}
            colorScheme="teal"
            isLoading={isSending}
          />
        </Stack>
      </form>
    </Container>
  );
}