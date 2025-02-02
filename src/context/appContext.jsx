import { createContext, useContext, useEffect, useRef, useState } from "react";
import supabase from "../supabaseClient";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  console.log("AppContextProvider initializing");
  
  let myChannel = null;
  const [username, setUsername] = useState("");
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [routeHash, setRouteHash] = useState("");
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] = useState(null);
  const [unviewedMessageCount, setUnviewedMessageCount] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  useEffect(() => {
    console.log("AppContextProvider mounted");
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        initializeUser(session);
      });

      getMessagesAndSubscribe();

      const storedCountryCode = localStorage.getItem("countryCode");
      if (storedCountryCode && storedCountryCode !== "undefined")
        setCountryCode(storedCountryCode);
      else getLocation();

      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("onAuthStateChange", { _event, session });
        initializeUser(session);
      });

      return () => {
        // Remove supabase channel subscription by useEffect unmount
        if (myChannel) {
          supabase.removeChannel(myChannel);
        }

        authSubscription.unsubscribe();
      };
    } catch (err) {
      console.error("Error in AppContextProvider:", err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    console.log("AppContextProvider mounted");
    try {
      // Effect to scroll to bottom on initial message load
      if (isInitialLoad) {
        setIsInitialLoad(false);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error in AppContextProvider:", err);
      setError(err.message);
    }
  }, [messages]);

  useEffect(() => {
    console.log("AppContextProvider mounted");
    try {
      if (!newIncomingMessageTrigger) return;

      if (newIncomingMessageTrigger.username === username) {
        scrollToBottom();
      } else {
        setUnviewedMessageCount((prevCount) => prevCount + 1);
      }
    } catch (err) {
      console.error("Error in AppContextProvider:", err);
      setError(err.message);
    }
  }, [newIncomingMessageTrigger]);

  const getLocation = async () => {
    try {
      const res = await fetch("https://api.db-ip.com/v2/free/self");
      const { countryCode, error } = await res.json();
      if (error) throw new Error(error);

      setCountryCode(countryCode);
      localStorage.setItem("countryCode", countryCode);
    } catch (error) {
      console.error(
        `error getting location from api.db-ip.com:`,
        error.message
      );
      setError(error.message);
    }
  };

  const randomUsername = () => {
    return `@user${Date.now().toString().slice(-4)}`;
  };
  const initializeUser = (session) => {
    setSession(session);
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    let username;
    if (session) {
      username = session.user.user_metadata.user_name;
    } else {
      username = localStorage.getItem("username") || randomUsername();
    }
    setUsername(username);
    localStorage.setItem("username", username);
  };

  const handleNewMessage = (payload) => {
    setMessages((prevMessages) => [payload.new, ...prevMessages]);
    //* needed to trigger react state because I need access to the username state
    setNewIncomingMessageTrigger(payload.new);
  };

  const getInitialMessages = async () => {
    if (messages.length) return;

    const { data, error } = await supabase
      .from("messages")
      .select()
      .range(0, 49)
      .order("id", { ascending: false });
    // console.log(`data`, data);

    setLoadingInitial(false);
    if (error) {
      setError(error.message);
      return;
    }

    setIsInitialLoad(true);
    setMessages(data);
    // scrollToBottom(); // not sure why this stopped working, meanwhile using useEffect that's listening to messages and isInitialLoad state.
  };

  const getMessagesAndSubscribe = async () => {
    setError("");

    await getInitialMessages();

    if (!myChannel) {
      // mySubscription = supabase
      // .from("messages")
      // .on("*", (payload) => {
      //   handleNewMessage(payload);
      // })
      // .subscribe();

      myChannel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            handleNewMessage(payload);
          }
        )
        .subscribe();
    }
  };

  const scrollRef = useRef();
  const onScroll = async ({ target }) => {
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
      setUnviewedMessageCount(0);
      setIsOnBottom(true);
    } else {
      setIsOnBottom(false);
    }

    //* Load more messages when reaching top
    if (target.scrollTop === 0) {
      // console.log("messages.length :>> ", messages.length);
      const { data, error } = await supabase
        .from("messages")
        .select()
        .range(messages.length, messages.length + 49)
        .order("id", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      target.scrollTop = 1;
      setMessages((prevMessages) => [...prevMessages, ...data]);
    }
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const value = {
    messages,
    loadingInitial,
    error,
    getMessagesAndSubscribe,
    username,
    setUsername,
    randomUsername,
    routeHash,
    scrollRef,
    onScroll,
    scrollToBottom,
    isOnBottom,
    country: countryCode,
    unviewedMessageCount,
    session,
  };

  console.log("AppContextProvider rendering with value:", value);

  return (
    <AppContext.Provider value={value}>
      {error ? (
        <div style={{ color: 'red', padding: '20px' }}>
          Error: {error}
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export { AppContext as default, AppContextProvider, useAppContext };
