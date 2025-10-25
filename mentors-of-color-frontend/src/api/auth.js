import { axiosServices1 } from "utils/axios";

export async function resetUserPassword(data) {
  try {
    await axiosServices1.post("auth/password/reset/confirm/", data)
  }
  catch (err) {
    let errorMessage = ''
    const { token, uid, new_password2 } = err.response.data

    if (token && token[0].toLowerCase().trim() === 'invalid value') {
      errorMessage += 'Invalid token value ';
    }
    if (uid && uid[0]?.toLowerCase()?.trim() === 'invalid value') {
errorMessage = errorMessage ? errorMessage + '+ Invalid uid value' : 'Invalid uid value';
    }
    if (new_password2) {
      errorMessage += new_password2.join(" ")
    }

    throw new Error("Can not set password because of " + errorMessage);
  }
}

export async function sendResetPasswordMail(email) {
    await axiosServices1.post("auth/password/reset/", { email });
}
    return
  }
  catch (err) {
    throw new Error("Some error occurred while sending reset instructions ");
  }
}