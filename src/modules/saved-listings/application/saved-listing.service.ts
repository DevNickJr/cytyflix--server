import crypto from "crypto";
import { SavedListing } from "@/modules/saved-listings/domain/saved-listing";
import { SavedListingRepository } from "@/modules/saved-listings/contracts/saved-listing.interfaces";


export class SavedListingService {
  constructor(private readonly savedListingRepo: SavedListingRepository) {}

  async toggleSave(userId: string, propertyId: string) {
    const existing = await this.savedListingRepo.findByUserAndProperty(userId, propertyId);

    if (existing) {
      await this.savedListingRepo.delete(userId, propertyId);
      return { saved: false, message: "Property removed from saved listings" };
    }

    const savedListing = new SavedListing(
      crypto.randomUUID(),
      userId,
      propertyId,
    );

    await this.savedListingRepo.save(savedListing);
    return { saved: true, message: "Property saved" };
  }

  async getSavedListings(userId: string, page = 1, limit = 20) {
    return this.savedListingRepo.findByUserId(userId, page, limit);
  }

  async checkIfSaved(userId: string, propertyId: string) {
    const existing = await this.savedListingRepo.findByUserAndProperty(userId, propertyId);
    return { saved: !!existing };
  }
}
