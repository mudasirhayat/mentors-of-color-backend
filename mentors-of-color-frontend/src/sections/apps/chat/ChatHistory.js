import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

// material-ui
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";

// project imports
import UserAvatar from "./UserAvatar";
import ChatMessageAction from "./ChatMessageAction";
import IconButton from "components/@extended/IconButton";
import CircularWithPath from "components/@extended/progress/CircularWithPath";
// import { useGetUserChat } from "api/chat";
import { ThemeMode } from "config";

// assets
import { EditOutlined } from "@ant-design/icons";
import useAuth from "hooks/useAuth";

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

const ChatHistory = ({
  theme,
  user: selectedChatList,
  mySocket,
  chat,
  setChat,
}) => {
  const bottomRef = useRef(null);

  const {
    user: { associated_user_id: programUserID },
  } = useAuth();

  useEffect(() => {
    if (!mySocket) return;

    const data = {
      type: "join_room",
      room_id: selectedChatList?.roomId,
      user_id: programUserID,
    };
    mySocket.send(JSON.stringify(data));
  }, [mySocket, selectedChatList]);

  useEffect(() => {
    // @ts-ignore
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    // eslint-disable-next-line
  }, [chat],[programUserID]);

  if (!mySocket) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100%" }}
      >
        <CircularWithPath />
      </Stack>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {chat.map((history, index) => (
        <Grid item xs={12} key={index}>
          {history.user_id === programUserID ? (
            <Stack spacing={1.25} direction="row" alignItems="flex-start">
              <Grid container justifyContent="flex-end">
                <Grid item xs={2} md={3} xl={4} />

                <Grid item xs={10} md={9} xl={8}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                  >
                    <ChatMessageAction index={index} />
                    <IconButton size="small" color="secondary">
                      <EditOutlined />
                    </IconButton>
                    <Card
                      sx={{
                        display: "inline-block",
                        float: "right",
                        bgcolor: theme.palette.primary.main,
                        boxShadow: "none",
                        ml: 1,
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 1,
                          pb: "8px !important",
                          width: "fit-content",
                          ml: "auto",
                        }}
                      >
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              color={theme.palette.grey[0]}
sx={{ overflowWrap: "anywhere" }}
{history && history.message && (
  <Typography>
    {history.message}
  </Typography>
)}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    align="right"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {history.user_name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    align="right"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {history.timestamp}
                  </Typography>
                </Grid>
              </Grid>
              <UserAvatar
                user={{
                  online_status: "available",
                  avatar: "avatar-1.png",
                  name: "User 1",
                }}
              />
            </Stack>
          ) : (
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              <UserAvatar
                user={{
try {
    online_status: selectedChatList.online_status,
    avatar: selectedChatList.avatar,
} catch (error) {
    console.error(error);
}
                  name: selectedChatList.name,
                }}
              />

              <Grid container>
                <Grid item xs={12} sm={7}>
                  <Card
                    sx={{
                      display: "inline-block",
                      float: "left",
                      bgcolor:
                        theme.palette.mode === ThemeMode.DARK
                          ? "background.background"
                          : "grey.0",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent sx={{ p: 1, pb: "8px !important" }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            color="textPrimary"
                            sx={{ overflowWrap: "anywhere" }}
                          >
                            {history.message}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography
                    align="left"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {history.user_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography
                    align="left"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {history.timestamp}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          )}
        </Grid>
      ))}
      <Grid item ref={bottomRef} />
    </Grid>
  );
};

ChatHistory.propTypes = {
  data: PropTypes.array,
  theme: PropTypes.object,
  user: PropTypes.object,
};

export default ChatHistory;
