import { Badge, Box, Container, Input, Button, Stack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import Messages from "./Messages";
import { BsChevronDoubleDown } from "react-icons/bs";
import supabase from '../supabaseClient';
import FileUpload from './FileUpload';

export default function Chat() {
  const [height, setHeight] = useState(window.innerHeight - 205);
  const {
    scrollRef,
    onScroll,
    scrollToBottom,
    isOnBottom,
    unviewedMessageCount,
  } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const channel = supabase
      .channel('realtime-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    const handleResize = () => setHeight(window.innerHeight - 205);
    window.addEventListener("resize", handleResize);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const { error } = await supabase
      .from('messages')
      .insert({ content: newMessage });

    if (!error) setNewMessage('');
  };

  return (
    <Container maxW="600px" pb="20px">
      <Box
        bg="white"
        p="5"
        overflow="auto"
        borderRadius="10px"
        height={height}
        onScroll={onScroll}
        ref={scrollRef}
      >
        <Messages />
        {!isOnBottom && (
          <div
            style={{
              position: "sticky",
              bottom: 8,
              float: "right",
              cursor: "pointer",
            }}
            onClick={scrollToBottom}
          >
            {unviewedMessageCount > 0 ? (
              <Badge
                ml="1"
                fontSize="0.8em"
                colorScheme="green"
                display="flex"
                borderRadius="7px"
                padding="3px 5px"
                alignItems="center"
              >
                {unviewedMessageCount}
                <BsChevronDoubleDown style={{ marginLeft: "3px" }} />
              </Badge>
            ) : (
              <BsChevronDoubleDown style={{ marginLeft: "3px" }} />
            )}
          </div>
        )}
        <Stack spacing={4} mt={4} direction="row" align="center">
          <Input
            flex="1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage} colorScheme="teal" px="8">
            Send
          </Button>
          <FileUpload />
        </Stack>
      </Box>
    </Container>
  );
}
