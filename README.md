nest new server -> yarn
src 정리, tsconfig.json paths 설정
prettier eslint 설정
.env src/auth, config, common 만들기

//기본적인 인증 전략(passport-jwt, refresh-token, cookie)
yarn add @nestjs/config @nestjs/jwt @nestjs/passport bcrypt mysql2 passport passport-jwt @nestjs/typeorm class-transformer class-validator typeorm
yarn add -D @types/bcrypt @types/passport-jwt

//파일 업로드 AWS-S3
multer은 nestjs 기본 내장
yarn add aws-sdk multer-s3
yarn add -D @types/multer
aws 버킷만들기 https://velog.io/@loakick/Github-Action-AWS-S3%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-8jk319fsq3

//swagger
yarn add @nestjs/swagger swagger-ui-express
OpenApi decorator추가해줘야 swagger 잘 사용 가능
이거 잘 적어주는게 협업할 때 중요할 듯
공식문서 openapi 참고 https://docs.nestjs.com/openapi/introduction
