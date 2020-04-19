# genese-api-angular  [![npm version](https://badge.fury.io/js/genese-api-angular.svg)](https://badge.fury.io/js/genese-api-angular)

genese-api-angular is a code generator for Angular apps.

This module will generate automatically your DTO models and your data-services from your OpenApi file. Moreover, with the help of [genese-angular](https://www.npmjs.com/package/genese-angular) module, all these data-services will use and return typed objects corresponding to the schemas included in you OpenApi file.

You can find a demonstrator of genese-api-angular [here](https://github.com/geneseframework/genese-api-angular-demo).

For more information about OpenApi specifications : [official website](https://swagger.io/specification/)

## Table of Contents
* [Why use genese-api-angular ?](#why-use-genese-api-angular-)
* [Installation](#1-installation)
* [Creation of OpenApi file](#2-creation-of-openapi-file)
* [Code generation](#3-code-generation)
* [Methods](#4-methods)


## Why use genese-api-angular ?

This module is a powerful tool which will improve your productivity in building web apps. 

genese-api-angular is a Genese module used for Angular applications, which will save your time and help you to develop Angular applications faster. With genese-api-angular, all your Angular data-services and all your DTOs will be automatically generated. No more html requests, no more mappers, no more tests of mappers...  With the help of [genese-angular](https://www.npmjs.com/package/genese-angular), genese-api-angular generates all the data-services with mappers which are returning typed objects coming from backend.

Returning typed objects from your data-services to your components is fundamental : if you do not, your components could receive incorrect data from the backend, and your application would crash. That's why the mappers are so important. Without Genese framework, writing mappers is long and fastidious: you need to write unit tests for your mappers, and add some mock values to be able to do these tests. Idem for your http requests, which should be tested with some tools like HttMock. Genese framework is doing that for you. 


 * ***DTOs***
 
 No need to write any data-model (DTO) : genese-api-angular will create them automatically (using your OpenApi file)
 
 * ***DATA-SERVICES***
 
 No need to write any data-service. No HTML requests, no mappers : genese-api-angular will create them for you (using your OpenApi file)
 
 * ***GET requests***
 
 You will be sure the objects received from your GET requests have correct type (under the hood, genese-mapper maps all your data)
 
 * ***PUT and POST requests***
 
 You will be sure to send correctly typed objects in your POST or PUT requests (with auto-completion in your preferred IDE)
 
 * ***DELETE requests***
 
 You will be sure the response returned by the DELETE method will be correctly typed (if you want to receive typed objects from DELETE methods)
 
 
[Top](#table-of-contents)
## 1. Installation

At first, you need to install the npm module:

```sh
npm i genese-api-angular
```

You need too to install Genese framework globally :

```sh
npm i -g genese
```

The minimum Angular version is Angular 8.

---

[Top](#table-of-contents)
## 2. Creation of OpenApi file

Supposing that you want to create a basic Angular application managing your book's library. Your API will contain only the classic CRUD methods getBook, getAllBooks, postBook, putBook and deleteBook. At first, you create your OpenAPI file (for example with [Apicurio](https://www.apicur.io/)).

You have one path /books for getAllBooks and postBook methods, and another path /books/{id} for getBook, putBook and deleteBook methods.

You will obtain approximately this OpenApi JSON file :


```json
{
    "openapi": "3.0.2",
    "info": {
        "title": "Books",
        "version": "1.0.0",
        "description": "CRUD operations"
    },
    "paths": {
        "/books": {
            "get": {
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Book"
                                    }
                                }
                            }
                        },
                        "description": "getAllBooks"
                    }
                },
                "summary": "Get all books"
            },
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/BookPost"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "postBook"
                    }
                }
            }
        },
        "/books/{id}": {
            "get": {
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Book"
                                }
                            }
                        },
                        "description": "getBook"
                    }
                }
            },
            "put": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/BookPut"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ResponseStatus"
                                }
                            }
                        },
                        "description": "putBookResponse"
                    }
                }
            },
            "delete": {
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ResponseStatus"
                                }
                            }
                        },
                        "description": "deleteBookResponse"
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "Book": {
                "description": "",
                "type": "object",
                "properties": {
                    "id": {
                        "description": "",
                        "type": "string"
                    },
                    "title": {
                        "description": "",
                        "type": "string"
                    },
                    "author": {
                        "description": "",
                        "type": "string"
                    }
                }
            },
            "BookPost": {
                "description": "",
                "required": [
                    "title",
                    "author"
                ],
                "type": "object",
                "properties": {
                    "author": {
                        "description": "",
                        "type": "string"
                    },
                    "title": {
                        "description": "",
                        "type": "string"
                    }
                }
            },
            "BookPostResponse": {
                "description": "",
                "type": "object",
                "properties": {
                    "id": {
                        "description": "",
                        "type": "string"
                    }
                }
            },
            "BookPut": {
                "description": "",
                "required": [
                    "author"
                ],
                "type": "object",
                "properties": {
                    "author": {
                        "description": "",
                        "type": "string"
                    }
                }
            },
            "ResponseStatus": {
                "description": "",
                "type": "object",
                "properties": {
                    "success": {
                        "description": "",
                        "type": "boolean"
                    }
                }
            }
        }
    }
}
```

---

[Top](#table-of-contents)
## 3. Code generation

At first, you must create your OpenApi file. You can do that easily with the excellent [Apicurio application](https://www.apicur.io/). Download the JSON file corresponding to your API and put it in the root folder of your application, with the name `genese-api.json`.

After that, you just need to enter this code in your terminal :

```ts
    genese new api
```

It will generate a folder `genese/genese-api`. Inside it, you will find all your DTOs and data-services, ready to use !

---

[Top](#table-of-contents)
## 4. Methods

| Method                 | Usage             |
| ---------------------- | ----------------- |
| [get()](#get)          | Get one book      |
| [getAll()](#getall)    | Get all books     |
| [post()](#post)        | Post one book     |
| [put()](#put)          | Put one book      |
| [delete()](#delete)    | Delete one book   |


### get()

In your component, call the method generated by genese-api-angular :
  
```ts
import { Component, OnInit } from '@angular/core';
import { GeneseRequestService } from '../../../../genese/genese-api/services/genese-request.service';
import { Book } from '../../../../genese/genese-api/datatypes/book.datatype';


@Component({
    selector: 'app-get',
    templateUrl: './get.component.html',
    styleUrls: ['./get.component.scss']
})
export class GetComponent implements OnInit {


    constructor(private readonly geneseService: GeneseRequestService) {}


    ngOnInit(): void {
        this.get('1');
    }

    get(id: string): void {
        this.geneseService.getBookById(id).subscribe((book: Book) => {
            console.log(`get() response `, book);
        });
    }
}

```

### getAll()

In your component, call the method generated by genese-api-angular :
  
```ts
import { Component, OnInit } from '@angular/core';
import { GeneseRequestService } from '../../../../genese/genese-api/services/genese-request.service';
import { Book } from '../../../../genese/genese-api/datatypes/book.datatype';


@Component({
    selector: 'app-get-all',
    templateUrl: './get-all.component.html',
    styleUrls: ['./get-all.component.scss']
})
export class GetAllComponent implements OnInit {


    constructor(private readonly geneseService: GeneseRequestService) {}


    ngOnInit(): void {
        this.getAll();
    }

    getAll(): void {
        this.geneseService.getBooks().subscribe((books: Book[]) => {
            console.log(`getAll() response`, books);
        });
    }
}

```


### post()

In your component, call the method generated by genese-api-angular :
  
```ts
import { Component, OnInit } from '@angular/core';
import { GeneseRequestService } from '../../../../genese/genese-api/services/genese-request.service';
import { BookPost, BookPostResponse } from '../../../../genese/genese-api/datatypes/book.datatype';


@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

    bookPost: BookPost = {
        author: 'Isaac Asimov',
        title: 'The caves of steel'
    }

    constructor(private readonly geneseService: GeneseRequestService) {}


    ngOnInit(): void {
        this.postBook();
    }

    postBook(): void {
        this.geneseService.postBook(this.bookPost).subscribe((bookPostResponse: BookPostResponse) => {
            console.log(`post() response `, bookPostResponse);
        });
    }
}

```


### put()

In your component, call the method generated by genese-api-angular :
  
```ts
import { Component, OnInit } from '@angular/core';
import { GeneseRequestService } from '../../../../genese/genese-api/services/genese-request.service';
import { BookPut, ResponseStatus } from '../../../../genese/genese-api/datatypes/book.datatype';


@Component({
    selector: 'app-put',
    templateUrl: './put.component.html',
    styleUrls: ['./put.component.scss']
})
export class PutComponent implements OnInit {

    bookPut: BookPut = {
        author: 'Isaac Asimov'
    }

    constructor(private readonly geneseService: GeneseRequestService) {}


    ngOnInit(): void {
        this.putBook('1');
    }

    putBook(id: string): void {
        this.geneseService.putBookById(this.bookPut, id).subscribe((responseStatus: ResponseStatus) => {
            console.log(`put() response `, responseStatus);
        });
    }
}

```

### delete()

In your component, call the method generated by genese-api-angular :
  
```ts
import { Component, OnInit } from '@angular/core';
import { GeneseRequestService } from '../../../../genese/genese-api/services/genese-request.service';
import { ResponseStatus } from '../../../../genese/genese-api/datatypes/book.datatype';


@Component({
    selector: 'app-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {


    constructor(private readonly geneseService: GeneseRequestService) {}


    ngOnInit(): void {
        this.deleteBook('1');
    }

    deleteBook(id: string): void {
        this.geneseService.deleteBookById(id).subscribe((responseStatus: ResponseStatus) => {
            console.log(`delete() response `, responseStatus);
        });
    }
}

```
