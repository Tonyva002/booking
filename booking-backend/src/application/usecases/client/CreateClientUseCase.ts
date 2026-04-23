import { ClientRepository } from "../../../domain/repositories/ClientRepository";
import { CreateClientDTO } from "../../dto/CreateClientDTO";

export class CreateClientUseCase {      
        constructor(private clientRepository: ClientRepository) {}

        async execute(dto: CreateClientDTO): Promise<number> {
                const name = dto.name.trim();
                const email = dto.email.trim();
                const phone = dto.phone.trim();

                if (!name || !email || !phone) {
                        throw new Error("All client fields are required");
                }
            return await this.clientRepository.create({
                name,
                email,
                phone,     
            });
        }
}