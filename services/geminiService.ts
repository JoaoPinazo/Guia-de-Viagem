import { GoogleGenAI, Type } from "@google/genai";
import { Tour, Restaurant, Party, Camping, Trail, Sport } from '../types';
import { imageCache } from "./imageCache";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
    if (imageCache.has(prompt)) {
        return imageCache.get(prompt)!;
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64Image = response.generatedImages[0].image.imageBytes;
            imageCache.set(prompt, base64Image);
            return base64Image;
        } else {
            throw new Error("Nenhuma imagem foi gerada.");
        }
    } catch (error) {
        console.error(`Error generating image for prompt "${prompt}":`, error);
        throw new Error("Falha ao gerar imagem.");
    }
};

const reviewSchema = {
    type: Type.ARRAY,
    description: "Uma lista com 2 a 3 avaliações de usuários simuladas, com nome do autor, nota (de 1 a 5, pode ser decimal como 4.5) e um breve comentário.",
    items: {
        type: Type.OBJECT,
        properties: {
            autor: { type: Type.STRING, description: "Nome do autor da avaliação." },
            nota: { type: Type.NUMBER, description: "Nota da avaliação, de 1 a 5." },
            comentario: { type: Type.STRING, description: "Comentário da avaliação." }
        },
        required: ["autor", "nota", "comentario"]
    }
};

const tourSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      nome: {
        type: Type.STRING,
        description: "O nome do ponto turístico ou passeio."
      },
      descricao: {
        type: Type.STRING,
        description: "Uma breve descrição do passeio, com 2 a 3 frases."
      },
      horario_funcionamento: {
        type: Type.STRING,
        description: "O horário de funcionamento do local. Ex: 'Diariamente, das 9h às 18h'."
      },
      endereco: {
        type: Type.STRING,
        description: "O endereço completo do ponto turístico. Ex: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, França'."
      },
      preco_ingresso: {
        type: Type.STRING,
        description: "O preço do ingresso ou custo médio do passeio. Ex: 'R$ 50,00 por pessoa', 'Gratuito'."
      },
      imagem_query: {
        type: Type.STRING,
        description: "Uma frase em inglês para buscar uma foto. Deve ser ultra-específica para obter uma imagem realista e de alta qualidade. Inclua termos como 'photorealistic', 'travel photography', o nome do local e a cidade. Ex: 'photorealistic wide angle daytime exterior of Colosseum in Rome, travel photography'."
      },
      destaques: {
        type: Type.ARRAY,
        description: "Uma lista com 3 a 4 destaques ou pontos principais a serem vistos no local.",
        items: {
          type: Type.STRING,
        },
      },
      avaliacoes: reviewSchema,
    },
    required: ["nome", "descricao", "horario_funcionamento", "endereco", "imagem_query", "destaques", "preco_ingresso", "avaliacoes"],
  }
};

const restaurantSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      nome: {
        type: Type.STRING,
        description: "O nome do restaurante."
      },
      descricao: {
        type: Type.STRING,
        description: "Uma breve descrição do restaurante e seus pratos principais, com 2 a 3 frases."
      },
      tipo_cozinha: {
        type: Type.STRING,
        description: "O tipo de cozinha do restaurante. Ex: 'Italiana', 'Brasileira', 'Japonesa'."
      },
      faixa_preco: {
        type: Type.STRING,
        description: "A faixa de preço do restaurante. Ex: 'Barato', 'Moderado', 'Caro'."
      },
      endereco: {
        type: Type.STRING,
        description: "O endereço completo do restaurante. Ex: 'R. Augusta, 2542 - Cerqueira César, São Paulo - SP, 01412-100'."
      },
      imagem_query: {
        type: Type.STRING,
        description: "Uma frase em inglês para buscar uma foto. Deve ser ultra-específica para obter uma imagem realista da fachada do restaurante. Inclua termos como 'photorealistic', 'street view facade', o nome do restaurante e a cidade. Ex: 'photorealistic street view facade of restaurant Osteria Francescana in Modena'."
      },
      cardapio: {
        type: Type.ARRAY,
        description: "Uma lista com 5 pratos populares do restaurante, incluindo nome e preço.",
        items: {
            type: Type.OBJECT,
            properties: {
                nome: {
                    type: Type.STRING,
                    description: "O nome do prato. Ex: 'Spaghetti Carbonara'."
                },
                preco: {
                    type: Type.STRING,
                    description: "O preço do prato, incluindo a moeda. Ex: 'R$ 55,00'."
                }
            },
            required: ["nome", "preco"],
        }
      },
      avaliacoes: reviewSchema,
    },
    required: ["nome", "descricao", "tipo_cozinha", "faixa_preco", "endereco", "imagem_query", "cardapio", "avaliacoes"],
  }
};

const partySchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        nome: {
          type: Type.STRING,
          description: "O nome da festa ou evento."
        },
        descricao: {
          type: Type.STRING,
          description: "Uma breve descrição da festa, o tipo de música ou atração principal."
        },
        data_evento: {
          type: Type.STRING,
          description: "O dia e data do evento. Ex: 'Sábado, 25 de Maio'."
        },
        endereco: {
            type: Type.STRING,
            description: "O endereço completo do local do evento. Ex: 'Av. Pacaembu, 1280 - Pacaembu, São Paulo - SP'."
        },
        preco_ingresso: {
            type: Type.STRING,
            description: "O preço do ingresso do evento. Ex: 'A partir de R$ 100,00', 'Entrada Franca'."
        },
        imagem_query: {
          type: Type.STRING,
          description: "Uma frase em inglês para buscar uma foto. Deve ser ultra-específica para obter uma imagem realista do ambiente do evento à noite. Inclua termos como 'event photography', 'vibrant lighting', 'crowd', e o nome do local. Ex: 'event photography vibrant lighting inside fabric club london'."
        },
        atracoes: {
            type: Type.ARRAY,
            description: "Uma lista com 2 a 3 atrações principais do evento (ex: DJs, bandas, tema).",
            items: {
              type: Type.STRING,
            },
          },
        avaliacoes: reviewSchema,
      },
      required: ["nome", "descricao", "data_evento", "endereco", "imagem_query", "atracoes", "preco_ingresso", "avaliacoes"],
    }
  };
  
const campingSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            nome: { type: Type.STRING, description: "Nome do local de acampamento." },
            descricao: { type: Type.STRING, description: "Breve descrição do camping e seus arredores." },
            endereco: { type: Type.STRING, description: "Endereço completo ou localização precisa do camping." },
            preco_diaria: {
                type: Type.STRING,
                description: "O preço médio da diária por pessoa ou por barraca. Ex: 'R$ 40,00 por pessoa', 'R$ 120,00 (barraca)'."
            },
            imagem_query: { type: Type.STRING, description: "Uma frase em inglês para buscar uma foto. Deve ser ultra-específica para obter uma imagem realista do camping. Inclua termos como 'photorealistic', 'campsite with tents', 'scenic nature', e o nome do local. Ex: 'photorealistic campsite with tents at Yosemite National Park scenic nature'." },
            infraestrutura: {
                type: Type.ARRAY,
                description: "Lista de 3-4 itens de infraestrutura disponíveis (Ex: 'Banheiros com chuveiro quente', 'Cozinha comunitária', 'Ponto de eletricidade').",
                items: { type: Type.STRING }
            },
            avaliacoes: reviewSchema,
        },
        required: ["nome", "descricao", "endereco", "imagem_query", "infraestrutura", "preco_diaria", "avaliacoes"]
    }
};

const trailSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            nome: { type: Type.STRING, description: "Nome da trilha." },
            descricao: { type: Type.STRING, description: "Breve descrição da trilha, paisagens e pontos de interesse." },
            ponto_partida: { type: Type.STRING, description: "Endereço ou local de início da trilha." },
            distancia: { type: Type.STRING, description: "Distância total da trilha (ida e volta). Ex: '10 km'." },
            dificuldade: { type: Type.STRING, description: "Nível de dificuldade da trilha (Ex: 'Fácil', 'Moderada', 'Difícil')." },
            custo_acesso: {
                type: Type.STRING,
                description: "Custo para acessar a trilha, se houver. Ex: 'Gratuito', 'R$ 15,00 (taxa de conservação)'."
            },
            imagem_query: { type: Type.STRING, description: "Uma frase em inglês para buscar uma foto. Deve ser ultra-específica para obter uma imagem de paisagem realista da trilha. Inclua termos como 'photorealistic', 'landscape photography', 'scenic view from trail', e o nome do local. Ex: 'photorealistic landscape photography scenic view from the Inca Trail to Machu Picchu'." },
            avaliacoes: reviewSchema,
        },
        required: ["nome", "descricao", "ponto_partida", "distancia", "dificuldade", "imagem_query", "custo_acesso", "avaliacoes"]
    }
};

const sportSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            nome: { type: Type.STRING, description: "Nome da atividade esportiva. Ex: 'Aula de Surf na Praia da Joaquina'." },
            descricao: { type: Type.STRING, description: "Breve descrição da experiência esportiva." },
            local: { type: Type.STRING, description: "Endereço ou local onde a atividade acontece." },
            nivel: { type: Type.STRING, description: "Nível de experiência recomendado (Ex: 'Iniciante', 'Todos os níveis', 'Avançado')." },
            preco_aula: {
                type: Type.STRING,
                description: "Preço da aula ou da experiência esportiva. Ex: 'R$ 150,00 por aula', 'R$ 200,00 (2 horas)'."
            },
            imagem_query: { type: Type.STRING, description: "Uma frase em inglês para buscar uma foto. Deve ser ultra-específica para obter uma imagem de ação realista de pessoas praticando o esporte no local. Inclua termos como 'photorealistic', 'action shot', 'sports photography', o nome do esporte e o local. Ex: 'photorealistic action shot people surfing at Joaquina beach Florianopolis, sports photography'." },
            equipamentos: {
                type: Type.ARRAY,
                description: "Lista de 2-3 equipamentos importantes inclusos ou necessários. Ex: 'Prancha de surf', 'Roupa de neoprene'.",
                items: { type: Type.STRING }
            },
            avaliacoes: reviewSchema,
        },
        required: ["nome", "descricao", "local", "nivel", "imagem_query", "equipamentos", "preco_aula", "avaliacoes"]
    }
};


export const fetchTours = async (location: string): Promise<Tour[]> => {
  try {
    const prompt = `Crie uma lista de 8 passeios turísticos populares para a cidade de '${location}'. Para cada passeio, forneça as informações solicitadas no schema, incluindo o endereço completo, 3-4 destaques, o preço do ingresso e 3 avaliações de usuários simuladas.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: tourSchema,
      },
    });

    const jsonText = response.text.trim();
    const tours: Tour[] = JSON.parse(jsonText);
    return tours;

  } catch (error) {
    console.error("Error fetching tours from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Falha ao buscar passeios: ${error.message}`);
    }
    throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API.");
  }
};

export const fetchRestaurants = async (location: string): Promise<Restaurant[]> => {
    try {
      const prompt = `Crie uma lista de 8 restaurantes populares e bem avaliados para a cidade de '${location}'. Inclua diferentes tipos de cozinha. Para cada restaurante, forneça as informações solicitadas no schema, incluindo o endereço completo, 5 itens do cardápio com preço e 3 avaliações de usuários simuladas.`;
  
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: restaurantSchema,
        },
      });
  
      const jsonText = response.text.trim();
      const restaurants: Restaurant[] = JSON.parse(jsonText);
      return restaurants;
  
    } catch (error) {
      console.error("Error fetching restaurants from Gemini API:", error);
      if (error instanceof Error) {
          throw new Error(`Falha ao buscar restaurantes: ${error.message}`);
      }
      throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API.");
    }
  };

  export const fetchParties = async (location: string): Promise<Party[]> => {
    try {
      const prompt = `Crie uma lista de 8 festas e eventos populares acontecendo na cidade de '${location}' durante esta semana. Inclua diferentes estilos. Para cada evento, forneça as informações solicitadas no schema, incluindo o endereço completo, as atrações, o preço do ingresso e 3 avaliações de usuários simuladas.`;
  
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: partySchema,
        },
      });
  
      const jsonText = response.text.trim();
      const parties: Party[] = JSON.parse(jsonText);
      return parties;
  
    } catch (error) {
      console.error("Error fetching parties from Gemini API:", error);
      if (error instanceof Error) {
          throw new Error(`Falha ao buscar festas: ${error.message}`);
      }
      throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API.");
    }
  };
  
export const fetchCampings = async (location: string): Promise<Camping[]> => {
    try {
        const prompt = `Crie uma lista de até 8 locais de acampamento próximos a '${location}'. Para cada local, forneça as informações solicitadas no schema, incluindo o preço da diária e 3 avaliações de usuários simuladas.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: campingSchema },
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error fetching campings:", error);
        throw new Error("Falha ao buscar acampamentos.");
    }
};

export const fetchTrails = async (location: string): Promise<Trail[]> => {
    try {
        const prompt = `Crie uma lista de até 8 trilhas para caminhada próximas a '${location}'. Para cada trilha, forneça as informações solicitadas no schema, incluindo o custo de acesso e 3 avaliações de usuários simuladas.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: trailSchema },
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error fetching trails:", error);
        throw new Error("Falha ao buscar trilhas.");
    }
};

export const fetchSports = async (location: string): Promise<Sport[]> => {
    try {
        const prompt = `Crie uma lista de até 8 atividades esportivas (como surf, caiaque, escalada, etc.) disponíveis em '${location}'. Para cada atividade, forneça as informações solicitadas no schema, incluindo o preço da aula e 3 avaliações de usuários simuladas.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: sportSchema },
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error fetching sports:", error);
        throw new Error("Falha ao buscar atividades esportivas.");
    }
};