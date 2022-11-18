import Button from "@components/Button";
import Header from "@components/Header";
import HighLight from "@components/HighLight";
import Input from "@components/Input";
import { Container, Content, Icon } from "./styles";


export default function NewGroup(){
  return(
    <Container>
      <Header showBackButton/>
      <Content>
        <Icon />
        <HighLight title="Turma" subtitle="Crie a turma para adicionar pessoas"/>
        <Input placeholder="Nome da turma"/>
        <Button title="Criar" style={{marginTop: 20}}/>
      </Content>
    </Container>
  )
}