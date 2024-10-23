import { Request, Response, NextFunction } from "express";
import { ErrorResponseInterface, ExpressErrorInterface } from "./config";

export abstract class ErrorServiceInterface {
  /**
   * @method hashPassword
   * @param {ExpressErrorInterface} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} res
   * @returns {void}
   */
  public static handler: (
    error: ExpressErrorInterface,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  /**
   * @method comparePassword
   * @param {ExpressErrorInterface} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} res
   * @returns {void}
   */
  public static converter: (
    error: ExpressErrorInterface,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  /**
   * @method comparePassword
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public static notFound: (req: Request, res: Response) => void;

  /**
   * @method reportError
   * @param {ErrorResponseInterface} error
   */
  public static reportError: (error: ErrorResponseInterface) => void;
}
