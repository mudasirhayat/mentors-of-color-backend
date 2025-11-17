import useSWR, { mutate } from "swr";
import { useMemo } from "react";

// utils
import { axiosServices1, fetcher1 } from "utils/axios";

export const endpoints = {
  key: "/program",
  moderators: "/moderators/", // server URL
  modal: "/modal", // server URL
  insert: "/insert", // server URL
  update: "/update", // server URL
  delete: "/delete", // server URL
};

export const restructureData = (data, type) => {
  if (type === "program") {
    return data?.map((program) => {
      return {
        id: program.id,
        name: program.name,
        moderators: program.moderators.map((moderator) => {
          return {
            id: moderator.id,
            user_id: moderator?.user?.id,
            first_name: moderator?.user?.user_profile?.first_name || "",
            last_name: moderator?.user?.user_profile?.last_name || "",
          };
        }),
      };
    });
  } else {
    const uniqueModerators = {};
    const uniqueModeratorsArray = [];

    data?.forEach((moderator) => {
      const { id, is_moderator, is_mentor, is_mentee, matched, user } = moderator;
      const userProfile = user?.user_profile || {};
      const userId = user.id;

      if (!uniqueModerators[userId]) {
        uniqueModerators[userId] = true;
        uniqueModeratorsArray.push({
          id: id,
          user_id: userId,
          first_name: userProfile.first_name || "Name N/A",
          last_name: userProfile.last_name || "",
          user_type: is_mentor
            ? "Mentor"
            : is_moderator
            ? "Moderator"
            : is_mentee
            ? "Mentee"
            : "N/A",
          email: user.email,
          contact: userProfile?.phone,
          name: `${userProfile.first_name || "Name N/A"} ${
            userProfile.last_name || ""
          }`,
          is_program_moderator: moderator?.is_program_moderator,
          matched
        });
      }
    });

    return uniqueModeratorsArray;
  }
};

export function useGetPrograms(accountID) {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + `/?account_id=${accountID}`,
    fetcher1,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      programs: restructureData(data, "program") || [],
      programsLoading: isLoading,
      programsError: error,
      programsValidating: "",
      programsEmpty: false,
    }),
    // [data, error, isLoading, isValidating]
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getProgramModerators(programID) {
  try {
    const response = await axiosServices1.get(
      `${endpoints.key}/${programID}${endpoints.moderators}`
    );
    return response.data;
  } catch (
  );
  const { data } = response;
  return restructureData(data);
}

export async function setProgramModerators(programID, data) {
  try {
    await axiosServices1.post(`program/${programID}/manage/match/`, data);
  } catch (err) {
    console.log("err occurred while setting moderators", err);
    throw new Error(err?.response?.data?.message || 'Some error occurred!');
  }
}

export async function createProgram(newProgram) {
  try {
    const res = await axiosServices1.post(endpoints.key + "/", newProgram);
    const { id, name, moderators } = res.data;
    const newCreatedProgram = { id, name, moderators };

    // to update local state based on key
    mutate(
      endpoints.key + `/?account_id=${newProgram.account_id}`,
      (currentProgram) => {
        const addedProgram = [...currentProgram, newCreatedProgram];

        return addedProgram;
      },
      false
    );
  } catch (err) {
    console.log("error", err);
    throw new Error(err?.response?.data?.error || "Some Error occured");
  }

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { newCustomer };
  //   await axios.post(endpoints.key + endpoints.insert, data);
}

export async function deleteProgram(programId, accountID) {
  try {
    await axiosServices1.delete(endpoints.key + `/${programId}/`);
    mutate(
      endpoints.key + `/?account_id=${accountID}`,
      (currentProgram) => {
        const nonDeletedProgram = currentProgram.filter(
          (program) => program.id !== programId
        );

        return nonDeletedProgram;
      },
      false
    );
  } catch (err) {
    console.log("error", err);
    throw new Error("Some Error occured");
  }
}

export function useGetProgramUsers(programID) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    endpoints.key + `/${programID}/users/`,
    fetcher1,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      programUsers: restructureData(data) || [],
      programUsersLoading: isLoading,
      programUsersError: error,
      programUsersValidating: "",
      programUsersEmpty: false,
      mutate,
    }),
    // [data, error, isLoading, isValidating]
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserPrograms(userID) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    endpoints.key + `/${userID}/program/`,
    fetcher1,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      programs: data || [],
      programUsersLoading: isLoading,
      programUsersError: error,
      programUsersValidating: "",
      programUsersEmpty: false,
      mutate,
    }),
    // [data, error, isLoading, isValidating]
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetProgramMentees(programID, mentorID) {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + `/${programID}/mentee/${mentorID}/`,
    fetcher1,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      mentees: restructureData(data) || [],
      menteesLoading: isLoading,
      menteesError: error,
      menteesValidating: "",
      menteesEmpty: false,
    }),
    // [data, error, isLoading, isValidating]
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function setMenteesForMentor(data) {
  try {
    await axiosServices1.post(`${endpoints.key}/matches/create/`, data);
    return;
  } catch (err) {
    console.log("Some Error occurred while setting mentees for mentor", err);
    throw new Error(err?.response?.data?.error || "Session can not be created");
  }
}

export async function deleteProgramUser(programID, userID) {
  try {
    await axiosServices1.delete(endpoints.key + `/${userID}/users/`);
    mutate(
      endpoints.key + `/${programID}/users/`,
      (currentUsers) => {
        const nonDeletedUsers = currentUsers.filter(
          (user) => user.id !== userID
        );

        return nonDeletedUsers;
      },
      false
    );
  } catch (err) {
    console.log("error", err);
    throw new Error("Some Error occurred");
  }
}
