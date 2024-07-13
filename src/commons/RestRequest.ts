/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export const RestRequest = (model: Function) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiBody({
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
    }),
  );
};
