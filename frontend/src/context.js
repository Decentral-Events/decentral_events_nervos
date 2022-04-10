const { createContext } = require("react");

export const AuthContext = createContext({
    isLoggedIn: false,
    user: {
        name: "",
        address: "",
        image: "",
        username: "",
        isAdmin: false
    },
    token: "",
    expireTimeStamp: 0,
    signer: null,
    setUser(newUser) { },
    setToken(newToken) { },
    setExpireTimeStamp(newExpireTimeStamp) { },
    setIsLoggedIn(isLoggedIn) { },
    setSigner(signer) { }
});