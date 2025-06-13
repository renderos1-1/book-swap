import { Controller, Post, Body, UseGuards, Request, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { User } from './entities/user.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear un nuevo libro (Solo usuarios autenticados)',
  })
  @ApiResponse({ status: 201, description: ' Libro creado con éxito' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Un libro con este título ya existe' })
  async createBook(@Body() createBookDto: CreateBookDto, @Request() req) {
    const existingBook = await this.bookRepository.findOne({
      where: { title: createBookDto.title },
    });

    if (existingBook) {
      throw new ConflictException('Un libro con este título ya existe');
    }

    const owner = await this.userRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!owner) {
      throw new Error('Usuario no encontrado');
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      owner,
    });

    const savedBook = await this.bookRepository.save(book);

    return {
      id: savedBook.id,
      title: savedBook.title,
      author: savedBook.author,
      description: savedBook.description,
      owner: {
        name: owner.name,
      },
    };
  }
}
