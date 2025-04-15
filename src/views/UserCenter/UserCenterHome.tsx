//orpheuswidget://

import { UserCenterStackParamList } from "@/types/NavigationType";
import { getCredentials } from "@/utils/keychain";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { View, Text,ScrollView, NativeScrollEvent, NativeSyntheticEvent, DeviceEventEmitter} from "react-native";
import { useUserCenter } from '@/store/index'
//orpheus://
export const UserCenterHome: React.FC = () => {
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid } = route.params; // 获取传递的 uid 参数
    console.log(uid, "头顶尖尖页面");
    const Scrolling = (event:NativeSyntheticEvent<NativeScrollEvent>)=>{
        //0 - 80 
        const { y } = event.nativeEvent.contentOffset;
        if(y <= 80){
            useUserCenter.scrollY = y;
        }else{
            useUserCenter.scrollY = 80;
        }

    }
    return (
        <ScrollView onScroll={Scrolling}>
            <Text>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et nisi odio non, mollitia earum accusamus ex ipsam alias voluptatibus laborum libero. Nostrum ad ab labore eligendi dolores perspiciatis voluptatibus exercitationem.
                Quisquam minus eaque veritatis neque magnam quas temporibus similique voluptas quae. Laudantium placeat earum iusto eveniet eaque molestiae corrupti voluptas voluptatum adipisci commodi. Quod deserunt autem asperiores quae. Nam, illo!
                Cum quisquam voluptas distinctio quis omnis. Temporibus soluta facere voluptatum dolor aliquid dolorum vitae, dolore quis mollitia eaque magnam quo porro repellendus neque excepturi animi vero laboriosam molestias beatae. Aliquid!
                Eum quam obcaecati sequi aperiam provident magni doloremque odit magnam dolorum, molestiae sit mollitia voluptas officiis ullam ipsa adipisci illum veniam atque saepe et impedit, culpa molestias repellendus in! Harum.
                Ab sed, illo obcaecati officia corrupti nostrum modi nam voluptate veniam error beatae cumque assumenda quae reprehenderit non quibusdam veritatis magnam in perspiciatis, tempore dolor repellendus, aut porro? Nesciunt, quisquam.
                Nesciunt sunt sapiente optio quasi impedit, adipisci rerum corrupti accusantium consectetur. Porro recusandae sed vero rem tenetur commodi pariatur dolor doloribus dolore qui delectus iure explicabo voluptatum exercitationem, nostrum cumque!
                Minus, at labore doloribus iste ipsam magni fuga doloremque soluta perferendis, et harum totam molestias mollitia! Vitae, nulla corrupti, consectetur quod assumenda qui necessitatibus nesciunt adipisci placeat dolore ducimus eius.
                Consequuntur incidunt laudantium sed sit perferendis maxime nisi sequi repellat repellendus dolorem tenetur, quis mollitia quia recusandae ratione voluptas omnis quae reprehenderit dolor officia, ducimus expedita laboriosam. Architecto, dolorum ratione?
                Commodi vel esse mollitia nisi, totam voluptates deleniti soluta atque voluptas iste molestiae quisquam accusantium sequi. Aperiam vero nobis sunt ratione ea ullam explicabo eius non omnis ipsam! Incidunt, officiis!
                Possimus animi nulla harum incidunt amet consequatur dolorem aliquid aspernatur ullam eveniet voluptatem cum dolore eligendi ea delectus atque quod voluptate sunt, neque quasi. Sapiente mollitia eligendi delectus atque nemo!
                Reiciendis in nostrum sit optio atque facilis similique. Ratione, eum. Veritatis deserunt ullam, nihil quae cupiditate quod adipisci qui possimus fuga non! Soluta repudiandae reiciendis minus laboriosam, delectus aliquid cum?
                Nihil, illo! Commodi fuga cum voluptatum ipsam tempore consequatur perspiciatis sunt veniam amet repudiandae doloribus, quas accusamus velit in cumque! At consectetur eveniet hic, tenetur exercitationem porro est dolorum rerum.
                Porro quibusdam delectus libero, adipisci eius, corporis beatae accusantium reprehenderit illo fugit veritatis debitis unde sunt saepe ipsa maiores, aut id eaque nostrum? Unde harum aspernatur adipisci assumenda, debitis distinctio.
                Ut similique ex error repellendus consequuntur eligendi, qui earum culpa at amet. Quo, ullam ratione nostrum repudiandae a, repellat animi nisi ut laborum aspernatur optio eius quisquam veniam, ea voluptate.
                Voluptates, repudiandae sint earum dignissimos, quaerat quos culpa ullam nihil maiores ut ducimus rerum consequatur illum harum commodi officiis assumenda fugit, dicta vel ipsa cum ipsam. Deleniti alias sequi magni.
                Cumque excepturi autem cupiditate doloremque maxime fugiat natus corrupti in odio delectus. Totam libero tempora vero beatae alias sed unde nesciunt, tempore facere corporis provident quibusdam laborum consectetur esse nemo?
                Asperiores ex minima assumenda repellat perspiciatis porro et exercitationem, laborum hic earum consequuntur voluptate fugiat molestias necessitatibus modi, quod ipsa sed suscipit, nostrum beatae culpa animi veniam repudiandae aspernatur? Itaque!
                Aliquid, quaerat perferendis reprehenderit error repellendus nemo quo optio. In, consectetur pariatur praesentium quisquam provident, vel nostrum delectus quo corporis tempora officia officiis ullam rem debitis ab aliquid amet aliquam?
                Quod ducimus veritatis nobis maxime vitae accusamus fugiat labore commodi et natus optio nisi ipsam laboriosam, excepturi numquam error voluptatibus quia earum reprehenderit quas distinctio, amet, cumque minima. Libero, distinctio.
                Provident esse dolores eius corrupti, dolor impedit suscipit eveniet ullam delectus nihil accusantium ipsam, facere a voluptas sequi deserunt omnis facilis sit deleniti quae numquam illum libero! Sapiente, nobis commodi.
            </Text>
        </ScrollView>
    );
};