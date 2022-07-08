export const getAuthorizationHeader = (): HeadersInit => {
  return {
    Authorization: "mysecrettoken",
  };
};
