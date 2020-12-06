import { container } from './ioc.container'
import { IApiService } from '../services/types'
import { ApiService } from '../services/api.service'
import { ApiServiceSymbol, AuthServiceSymbol, ForumServiceSymbol, MessageServiceSymbol, ProfileServiceSymbol } from '../services/ioc.symbols'
import { AuthService } from '../services/my/auth.service'
import { IAuthService, IProfileService } from '../services/my/types'
import { ProfileService } from '../services/my/profile.service'
import { IForumService, IMessageService } from '../services/forum/types'
import { MessageService } from '../services/forum/message.service'
import { ForumService } from '../services/forum/forum.service'

container.bind<IApiService>(ApiServiceSymbol).to(ApiService)
container.bind<IAuthService>(AuthServiceSymbol).to(AuthService)
container.bind<IProfileService>(ProfileServiceSymbol).to(ProfileService)
container.bind<IMessageService>(MessageServiceSymbol).to(MessageService)
container.bind<IForumService>(ForumServiceSymbol).to(ForumService)
