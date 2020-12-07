import { container } from './ioc.container'
import { IApiService } from '../services/types'
import { ApiService } from '../services/api.service'
import {
  ApiServiceSymbol,
  AuthServiceSymbol, BoardPrepareServiceSymbol, BoardServiceSymbol, CategoryPrepareServiceSymbol, CategoryServiceSymbol,
  ForumServiceSymbol,
  MessagePrepareServiceSymbol,
  MessageServiceSymbol,
  ProfileServiceSymbol
} from '../services/ioc.symbols'
import { AuthService } from '../services/my/auth.service'
import { IAuthService, IProfileService } from '../services/my/types'
import { ProfileService } from '../services/my/profile.service'
import { IForumService, IMessagePrepareService, IMessageService } from '../services/forum/types'
import { MessageService } from '../services/forum/message/message.service'
import { ForumService } from '../services/forum/forum.service'
import { MessagePrepareService } from '../services/forum/message/message-prepare.service'
import { CategoryPrepareService } from '../services/forum/category/category-prepare.service'
import { CategoryService } from '../services/forum/category/category.service'
import { BoardPrepareService } from '../services/forum/board/board-prepare.service'
import { BoardService } from '../services/forum/board/board.service'

container.bind<IApiService>(ApiServiceSymbol).to(ApiService)
container.bind<IAuthService>(AuthServiceSymbol).to(AuthService)
container.bind<IProfileService>(ProfileServiceSymbol).to(ProfileService)

container.bind<IForumService>(ForumServiceSymbol).to(ForumService)

container.bind<IMessageService>(MessageServiceSymbol).to(MessageService)
container.bind<IMessagePrepareService>(MessagePrepareServiceSymbol).to(MessagePrepareService)

container.bind<BoardService>(BoardServiceSymbol).to(BoardService)
container.bind<BoardPrepareService>(BoardPrepareServiceSymbol).to(BoardPrepareService)

container.bind<CategoryService>(CategoryServiceSymbol).to(CategoryService)
container.bind<CategoryPrepareService>(CategoryPrepareServiceSymbol).to(CategoryPrepareService)



