import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Book } from './entities/book.entity';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  @Get('books')
  @ApiOperation({ summary: 'Obtener todos los libros (publico)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los libros disponibles con detalles del propietario',
  })
  async getBooks() {
    return this.bookRepository.find({
      relations: ['owner'],
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        owner: {
          name: true,
        },
      },
    });
  }
}
