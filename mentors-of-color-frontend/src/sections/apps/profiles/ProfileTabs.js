import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Divider,
  FormLabel,
  Grid,
  TextField,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import userJson from "utils/locales/user.json";

// project import
import ProfileTab from "./ProfileTab";
import MainCard from "components/MainCard";
import IconButton from "components/@extended/IconButton";
import Avatar from "components/@extended/Avatar";

import { facebookColor, linkedInColor, twitterColor, ThemeMode } from "config";

// assets
import {
  FacebookFilled,
  LinkedinFilled,
  MoreOutlined,
  TwitterSquareFilled,
  CameraOutlined,
} from "@ant-design/icons";
import useAuth from "hooks/useAuth";
import { uploadImageToS3 } from "utils/s3Uploader";

const avatarImage = require.context("assets/images/users", true);

// ==============================|| USER PROFILE - TAB CONTENT ||============================== //

const ProfileTabs = ({ focusInput }) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
  const { user } = useAuth();

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
      uploadImageToS3(selectedImage);
    }
  }, [selectedImage]);

  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Stack spacing={2.5} alignItems="center">
            <FormLabel
              htmlFor="change-avtar"
              sx={{
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
                "&:hover .MuiBox-root": { opacity: 1 },
                cursor: "pointer",
              }}
            >
              <Avatar
                alt="Avatar 1"
                src={avatar}
                sx={{ width: 124, height: 124, border: "1px dashed" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor:
                    theme.palette.mode === ThemeMode.DARK
                      ? "rgba(255, 255, 255, .75)"
                      : "rgba(0,0,0,.65)",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <CameraOutlined
                    style={{
                      color: theme.palette.secondary.lighter,
                      fontSize: "2rem",
                    }}
                  />
                  <Typography sx={{ color: "secondary.lighter" }}>
                    Upload
                  </Typography>
                </Stack>
              </Box>
            </FormLabel>
            <TextField
              type="file"
              id="change-avtar"
              placeholder="Outlined"
              variant="outlined"
              sx={{ display: "none" }}
              onChange={(e) => setSelectedImage(e.target.files?.[0])}
            />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">
                {user?.user_profile.first_name} {user?.user_profile.last_name}
              </Typography>
              <Typography color="secondary">
                {userJson[user?.user_type]}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={3}
              sx={{ "& svg": { fontSize: "1.15rem", cursor: "pointer" } }}
            >
              <TwitterSquareFilled style={{ color: twitterColor }} />
              <FacebookFilled style={{ color: facebookColor }} />
              <LinkedinFilled style={{ color: linkedInColor }} />
            </Stack>
          </Stack>
        </Grid>
        <Grid item sm={3} sx={{ display: { sm: "block", md: "none" } }} />
        <Grid item xs={12}>
          <ProfileTab />
        </Grid>
      </Grid>
    </MainCard>
  );
};

ProfileTabs.propTypes = {
  focusInput: PropTypes.func,
};

export default ProfileTabs;
