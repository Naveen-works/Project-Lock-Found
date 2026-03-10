package com.example.backend.services;

import com.example.backend.dtos.LostItemRequestDto;
import com.example.backend.dtos.LostItemResponseDto;
import java.util.List;

public interface LostItemService {
    LostItemResponseDto reportLostItem(LostItemRequestDto requestDto, String username);

    List<LostItemResponseDto> getAllLostItems();

    List<LostItemResponseDto> getReportedItemsByUser(String username);

    LostItemResponseDto reportFoundItem(Long itemId, String adminUsername);

    LostItemResponseDto markAsClaimed(Long itemId, String adminUsername);

    LostItemResponseDto dispatchItem(Long itemId, String adminUsername);
}
