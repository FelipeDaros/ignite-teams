import { GroupCard } from "@components/GroupCard";
import Header from "@components/Header/index";
import HighLight from "@components/HighLight";
import ListEmpty from "@components/ListEmpty";
import { useState } from "react";
import { FlatList } from "react-native";
import {Container} from "./styles";

export default function Groups(){
  const [groups, setGroups] = useState<string[]>([]);

  return(
    <Container>
      <Header />
      <HighLight title="Turmas" subtitle="jogue com a sua turma"/>
      <FlatList 
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <GroupCard title={item}/>
        )}
        contentContainerStyle={groups.length === 0 && {flex: 1}}
        ListEmptyComponent={() => (
          <ListEmpty message="Que tal cadastrar a primeira turma ?"/>
        )}
      />
      
    </Container>
  )
}