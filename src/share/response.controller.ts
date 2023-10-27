import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class ResponseController {
  responseCustom(
    res: Response,
    data: any,
    optional: ResponseOption = {
      total: null,
      message: null,
      skip: null,
      take: null,
      successCode: null,
      extraData: null,
      statusCode: HttpStatus.OK,
    },
  ) {
    const skip = optional.skip || 0;
    const take = optional.take || null;
    const { message, total, successCode, statusCode, extraData } = optional;
    res.status(statusCode).send({
      statusCode,
      message,
      data: data,
      total,
      successCode,
      skip,
      take,
      extraData,
    });
  }

  /**
   * function handle send response to client
   * @param data
   * @param message
   * @param statusCode
   */
  responseSuccess(
    res: Response,
    data: any,
    optional: ResponseOption = {
      total: null,
      message: null,
      skip: null,
      take: null,
      successCode: null,
      statusCode: HttpStatus.OK,
    },
  ) {
    const { message, successCode, statusCode } = optional;
    res.status(statusCode).send({
      statusCode,
      message,
      data: data,
      total: optional.total ?? undefined,
      successCode,
      skip: optional.skip ?? undefined,
      take: optional.take ?? undefined,
    });
  }
}

type ResponseOption = {
  total?: number;
  message?: string;
  skip?: number;
  take?: number;
  successCode?: string;
  extraData?: any;
  statusCode?: HttpStatus;
};
