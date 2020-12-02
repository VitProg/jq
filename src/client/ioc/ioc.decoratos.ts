import { createDecorator } from '@owja/ioc';
import { container } from './ioc.container'

export const inject = createDecorator(container);
