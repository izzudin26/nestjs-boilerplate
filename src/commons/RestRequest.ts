import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export const RestRequest = (model: any) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiBody({
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
    }),
  );
};
