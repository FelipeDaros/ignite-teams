import Button from "@components/Button";
import { GroupCard } from "@components/GroupCard";
import Header from "@components/Header/index";
import HighLight from "@components/HighLight";
import ListEmpty from "@components/ListEmpty";
import Loading from "@components/Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { groupsGetALl } from "@storage/group/groupsGetAll";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import {Container} from "./styles";

export default function Groups(){
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup(){
    navigation.navigate('newGroup')
  }

  async function fetchGroups() {
    try {
      const data = await groupsGetALl();

      setGroups(data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate("players", {group});
  }

  
  useFocusEffect(useCallback(() => {
    fetchGroups();

  },[]));

  return(
    <Container>
      <Header />
      <HighLight title="Turmas" subtitle="jogue com a sua turma"/>
      {
        isLoading ? <Loading /> :
          <FlatList 
            data={groups}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <GroupCard 
                title={item}
                onPress={() => handleOpenGroup(item)}
              />
            )}
            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty message="Que tal cadastrar a primeira turma?" />
            )}
          />
      }
      <Button title="Criar uma nova turma" onPress={handleNewGroup}/>
    </Container>
  )
}