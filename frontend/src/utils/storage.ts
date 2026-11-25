const authKeys = ["accessToken", "refreshToken", "user"] as const;

const getValue = (key: (typeof authKeys)[number]) =>
  localStorage.getItem(key) ?? sessionStorage.getItem(key);

const setValue = (
  key: (typeof authKeys)[number],
  value: string,
  remember = true
) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
  (remember ? localStorage : sessionStorage).setItem(key, value);
};

const removeValue = (key: (typeof authKeys)[number]) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

export const storage = {
  getToken: () => getValue("accessToken"),
  setToken: (token: string, remember = true) =>
    setValue("accessToken", token, remember),
  removeToken: () => removeValue("accessToken"),

  getRefreshToken: () => getValue("refreshToken"),
  setRefreshToken: (token: string, remember = true) =>
    setValue("refreshToken", token, remember),

  getUser: () => {
    const user = getValue("user");
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: unknown, remember = true) =>
    setValue("user", JSON.stringify(user), remember),
  removeUser: () => removeValue("user"),

  isRemembered: () => localStorage.getItem("accessToken") !== null,

  clear: () => authKeys.forEach(removeValue),
};