"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true,
});
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _indexroutes = /*#__PURE__*/ _interop_require_default(
  require("./routes/index.routes")
);
const _error = require("./util/error");
const _expressratelimit = /*#__PURE__*/ _interop_require_default(
  require("express-rate-limit")
);
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _passportlocal = /*#__PURE__*/ _interop_require_default(
  require("./config/passport-local")
);
const _db = require("./config/db");
const _cookieparser = /*#__PURE__*/ _interop_require_default(
  require("cookie-parser")
);
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
function _interop_require_default(obj) {
  return obj && obj.__esModule
    ? obj
    : {
        default: obj,
      };
}
(async () => {
  await _db.User.create({
    data: {
      email: "neba@gmail.com",
      lastName: "Daniel",
      firstName: "Nebiyu",
      password: "$2a$10$/EWAVkYrFEnQGo9oIGeyqeg.BcD/Ybtv2SIMuVDfhzHLCtaKcRjnS",
    },
  });
})();
const app = (0, _express.default)();
app.use(_express.default.static(_path.default.join(__dirname, "uploads")));
app.use(_express.default.json());
app.use(
  (0, _cors.default)({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3000"],
  })
);
app.use((0, _cookieparser.default)());
app.use(_passport.default.initialize({}));
app.use(_indexroutes.default);
app.use((0, _expressratelimit.default)());
app.listen(80, () => {
  console.log("Server started on port 4000");
});
(0, _passportlocal.default)(_passport.default);
//global error handler
app.use(_error.globalErrorHandler);
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
  // app.close(() => {
  //   process.exit(1);
  // }
  // );
});
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
  // app.close(() => {
  //   process.exit(1);
  // });
});