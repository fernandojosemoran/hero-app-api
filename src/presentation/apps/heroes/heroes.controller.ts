/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";

import HeroService from "./heroes.service";
import HeroRepositoryImpl from "../../../infrastructure/repositories/hero.repository.impl";
import HeroDatasourceImpl from "../../../infrastructure/datasources/hero.datasource.impl";
import LogService from "../../../presentation/services/log.service";
import CreateHeroDto from "../../../domain/dto/heroes/create-hero.dto";
import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";
import GetHeroByIdDto from "../../../../src/domain/dto/heroes/get-hero-by-id.dto";
import DeleteHeroDto from "../../../../src/domain/dto/heroes/delete-hero.dto";
import UpdateHeroDto from "../../../../src/domain/dto/heroes/update-hero.dto";
import HttpError from "../../../../src/infrastructure/errors/http-error";
import SearchHeroDto from "../../../../src/domain/dto/heroes/search-hero.dto";
import DbDatasourceImpl from "../../../../src/infrastructure/datasources/db.datasource.impl";

interface IHeroController {
    createHero(request: Request, response: Response, next: NextFunction): any;
    getAllHeroes(request: Request, response: Response, next: NextFunction): any;
    getHeroById(request: Request, response: Response, next: NextFunction): any;
    deleteHero(request: Request, response: Response, next: NextFunction): any;
    updateHero(request: Request, response: Response, next: NextFunction): any;
}

export class HeroController implements IHeroController{
    private readonly contextPath: string = "./src/presentation/apps/heroes/heroes.controller.ts";

    public constructor(
        private readonly heroService: HeroService,
        private readonly logService: LogService
    ) {}

    private handlerErrorHttpResponse = (origin: string,response: Response, error: HttpError | Error) => {
        if (!(error instanceof HttpError)) { 
            this.logService.errorLog(error.message, `${this.contextPath} | ${origin}`, true);
            return response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ response: "Internal Server Error" });
        }

        this.logService.errorLog(error.message, `${this.contextPath} | ${origin}`);

        return response.status(error.status).json({ response: error.message });
    };
    
    public createHero = (request: Request, response: Response): any => {
        const [ dto, error ] = CreateHeroDto.create(request.body);

        if (error) {
            this.logService.errorLog(error, `${this.contextPath} | createHero()`, true);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        }

        this.heroService.createHero(dto!)
        .then(hero => response.status(HttpStatusCode.CREATED).json({ response: hero })) 
        .catch((error: HttpError | Error) => this.handlerErrorHttpResponse("createHero()",response,error));
    };

    public getAllHeroes = (_: Request, response: Response): any => {
        this.heroService.getAllHeroes()
        .then(heroes => response.status(HttpStatusCode.OK).json({ response: heroes }))
        .catch((error: HttpError | Error) => this.handlerErrorHttpResponse("getAllHeroes()",response,error));
    };

    public getHeroById = (request: Request, response: Response): any => {
        const [ dto, error ] = GetHeroByIdDto.create(request.params.id);

        if (error) {
            this.logService.errorLog(error, `${this.contextPath} | getHeroById()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        }

        this.heroService.getHeroById(dto!)
        .then(hero => response.status(HttpStatusCode.OK).json({ response: hero }))
        .catch((error: HttpError | Error) => this.handlerErrorHttpResponse("getHeroById()",response,error));
    };

    public deleteHero = (request: Request, response: Response): any => {
        const [ dto, error ] =  DeleteHeroDto.create(request.params.id);

        if (error) {
            this.logService.errorLog(error, `${this.contextPath} | deleteHero()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        };

        this.heroService.deleteHero(dto!)
        .then(res => response.status(HttpStatusCode.OK).json({ response: res }))
        .catch((error: HttpError | Error) => this.handlerErrorHttpResponse("deleteHero()",response,error));
    };

    public updateHero = (request: Request, response: Response): any => {
        const [ dto, error ] = UpdateHeroDto.create({ ...request.body, ...request.params });

        if (error) {
            this.logService.errorLog(error, `${this.contextPath} | updateHero()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        };

        this.heroService.updateHero(dto!)
        .then(res => response.status(HttpStatusCode.ACCEPTED).json({ response: res }))
        .catch((error: HttpError | Error) => this.handlerErrorHttpResponse("updateHero()",response,error));
    };

    public searchHero = (request: Request, response: Response): any => {
        const [ dto, error ] = SearchHeroDto.create(request.params.superhero);

        if (error) {
            this.logService.errorLog(error, `${this.contextPath} | searchHero()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        };

        this.heroService.searchHero(dto!)
        .then(heroes => response.status(HttpStatusCode.OK).json({ response: heroes }))
        .catch((error: HttpError | Error) => this.handlerErrorHttpResponse("searchHero()",response,error));
    };
}

const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("hero");
const heroDatasource: HeroDatasourceImpl = new HeroDatasourceImpl(dbDatasource);
const heroRepository: HeroRepositoryImpl = new HeroRepositoryImpl(heroDatasource);

export default new HeroController(
    new HeroService(heroRepository),
    new LogService()
);