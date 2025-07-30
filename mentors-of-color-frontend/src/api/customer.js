import useSWR, { mutate } from "swr";
import { useMemo } from "react";

// utils
import { axiosServices1, fetcher1 } from "utils/axios";

export const endpoints = {
  key: "account/",
  list: "/list", // server URL
  modal: "/modal", // server URL
  insert: "/insert", // server URL
  update: "/update", // server URL
  delete: "/delete",
  invite: "auth/registration/", // server URL
};

export function useGetCustomer(loginUserID, accountID) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    endpoints.key + `?user_id=${loginUserID}&account_id=${accountID}`,
    fetcher1,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      customers: data,
      customersLoading: isLoading,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function inviteUser(newUser) {
  await axiosServices1.post(endpoints.invite, newUser);
}

export async function updateCustomer(
  customerId,
  loginUserID,
  accountID,
  updatedValues
) {
  try {
    const updatedCustomer = {
      first_name: updatedValues.first_name,
      last_name: updatedValues.last_name,
      phone: updatedValues.user_contact_number,
      // user_type: updatedValues.user_type,
    };
    await axiosServices1.put(`account/${customerId}/`, updatedCustomer);
    mutate(
      endpoints.key + `?user_id=${loginUserID}&account_id=${accountID}`,
      (currentCustomer) => {
        const newCustomer = currentCustomer.map((customer) =>
          customer.id === customerId
            ? { ...customer, ...updatedValues }
            : customer
        );

        return newCustomer;
      },
      false
    );
  } catch (err) {
    console.log("error", err);
    throw new Error("Some Error occured");
  }

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { list: updatedCustomer };
  //   await axios.post(endpoints.key + endpoints.update, data);
}

export async function deleteCustomer(userID, loginUserID, accountID) {
  try {
    await axiosServices1.delete(`account/${userID}/`);

    mutate(
      endpoints.key + `?user_id=${loginUserID}&account_id=${accountID}`,
      (currentCustomer) => {
        const nonDeletedCustomer = currentCustomer.filter(
          (customer) => customer.id !== userID
        );
        return nonDeletedCustomer;
      },
      false
    );
  } catch (err) {
    console.log("error", err);
    throw new Error("Some Error occurred");
  }
}
