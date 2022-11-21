import Button from "@components/Button";
import ButtonIcon from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import Header from "@components/Header";
import HighLight from "@components/HighLight";
import Input from "@components/Input";
import ListEmpty from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { PlayerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoverByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { AppError } from "@utils/AppError";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

type RouteParams = {
  group: string
}

export default function Players(){
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const route = useRoute();
  const {group} = route.params as RouteParams;

  const navigation = useNavigation(); 

  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert("Nova pessoa", "Informe o nome da pessoa para adicionar!")
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await PlayerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();
      
      setNewPlayerName('');
      fetchPlayersByTeam();
      
    } catch (error) {
      if(error instanceof AppError){
        return Alert.alert("Nova pessoa", error.message);
      }else{
        console.log(error)
        return Alert.alert("Nova pessoa", "Houve um erro ao adicionar uma pessoa!");
      }
    }
  }

  async function fetchPlayersByTeam() {
    
    try {
      setIsLoading(true);
      const playersByTeam = await playerGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
      
    } catch (error) {
      console.log(error);
      Alert.alert("Pessoas", "Não foi possível carregar as pessoas do time selecionado");
    }finally{
      setIsLoading(false);
    }
  }

  async function handlePlayerRemover(playerName: string){
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert("Remover pessoa", "Não foi possível remover essa pessoa.");
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');

    } catch (error) {
      console.log(error);
      Alert.alert('Remover Grupo', 'Não foi posível remover o grupo');
    }
  }

  async function handleGroupremove() {
    Alert.alert("Remover", "Você deseja remover o grupo ?", [
      {text: 'Não', style: 'cancel'},
      {text: 'Sim', onPress: () => groupRemove()}
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return(
    <Container>
      <Header showBackButton/>
      <HighLight title={group} subtitle="Adicione a galera e separe os times"/>
      
      <Form>
        <Input 
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          inputRef={newPlayerNameInputRef}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer}/>
      </Form>
      
      

      <HeaderList>
        <FlatList 
          data={["Time A", "Time B"]}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <Filter title={item} isActive={item === team} onPress={() => setTeam(item)}/>
          )}
          horizontal
        />
        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>
      <FlatList 
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard 
            name={item.name} 
            onRemove={() => handlePlayerRemover(item.name)}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time"/>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {paddingBottom: 30},
          players.length === 0 && {flex: 1}
        ]}
      />

      <Button 
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupremove}
      />
    </Container>
  )
}