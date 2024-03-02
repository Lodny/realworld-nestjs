import { SetMetadata } from '@nestjs/common';

// export const Secured = (...args: string[]) => SetMetadata('secured', args);
export const Secured = () => SetMetadata('secured', 'secured');
