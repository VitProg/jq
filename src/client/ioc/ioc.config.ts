import { container } from './ioc.container'
import { IApiService } from '../services/types'
import { ApiService } from '../services/api.service'
import { ApiServiceSymbol, AuthServiceSymbol, MessagesServiceSymbol, ProfileServiceSymbol } from '../services/ioc.symbols'
import { AuthService } from '../services/my/auth.service'
import { IAuthService, IProfileService } from '../services/my/types'
import { ProfileService } from '../services/my/profile.service'
import { IMessagesService } from '../services/forum/types'
import { MessagesService } from '../services/forum/messages.service'

container.bind<IApiService>(ApiServiceSymbol).to(ApiService)
container.bind<IAuthService>(AuthServiceSymbol).to(AuthService)
container.bind<IProfileService>(ProfileServiceSymbol).to(ProfileService)
container.bind<IMessagesService>(MessagesServiceSymbol).to(MessagesService)
