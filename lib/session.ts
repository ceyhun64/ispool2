import withSession from "next-session";

export const session = withSession({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 gün
  },
});
