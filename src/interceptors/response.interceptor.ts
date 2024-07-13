import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { RestResource } from 'src/commons/restResource';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, RestResource<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<RestResource<T>> {
    const http = context.switchToHttp();
    const res = http.getResponse();
    const req = http.getRequest();

    /**
     * Is Asset Request
     * Return Pipe Response Streamable
     */
    const excludesPipe = ['/asset/', '/download'];
    const isExclude = excludesPipe.some((s) => req.url.includes(s));
    if (isExclude && req.method == 'GET') {
      return next.handle();
    }

    /**
     * Response JSON
     */

    return next.handle().pipe(
      map((data) => {
        const response: RestResource<T> = {
          statusCode: res.statusCode,
          message: HttpStatus[res.statusCode],
          isError: false,
          data: data,
        };

        return plainToInstance(RestResource<T>, response);
      }),
    );
  }
}
