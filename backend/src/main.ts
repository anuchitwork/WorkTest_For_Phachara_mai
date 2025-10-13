import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js dev server
      'https://front-worktest-for-phachara-mai.onrender.com', // Production URL
    ], // Next.js dev server
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // สร้าง Swagger options
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('API สำหรับจัดการ User')
    .setVersion('1.0')
    .build();

  // สร้าง document
  const document = SwaggerModule.createDocument(app, config);

  // ตั้ง route สำหรับ Swagger UI
  SwaggerModule.setup('docs', app, document);

  await app.listen(5000);
}
bootstrap();
