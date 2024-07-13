/* eslint-disable @typescript-eslint/no-unused-vars */
interface String {
  isNullOrEmpty(): boolean;
}

String.prototype.isNullOrEmpty = function () {
  return this == null || (this as string).trim() == '';
};
